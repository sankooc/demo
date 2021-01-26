/* eslint no-var:0, prefer-arrow-callback:0, prefer-template:0, object-shorthand:0 */

/**
 * Created by Mamba on 7/20/16.
 */


const PREFIX = 'common/';

const swap = (fname, name) => {
  if(/^[\S\s]*\.\w+$/.test(fname)) {
    return fname.replace(/^[\S\s]*(\.\w+)$/, `${name}$1`);
  }
  return fname;
};

const getMD5 = (file) => new Promise((resolve, reject) => {
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  const chunkSize = 1024 * 1024 * 2;
  const chunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;
  const spark = new window.SparkMD5();
  const fileReader = new FileReader();

  const loadNext = () => {
    const start = currentChunk * chunkSize;
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    fileReader.readAsBinaryString(blobSlice.call(file, start, end));
  };
  fileReader.onload = (e) => {
    spark.appendBinary(e.target.result);
    currentChunk += 1;
    if (currentChunk < chunks) {
      loadNext();
    } else {
      const md = spark.end();
      resolve(md);
    }
  };

  fileReader.onerror = () => {
    reject();
  };
  loadNext();
});

const uploadByClient = async (file) => {
  const service = new window.upyun.Bucket('sp-images-yunji');
  const size = file.size;
  const md5 = await getMD5(file);
  // const filepath = swap(file.name, md5);
  const filepath = file.name

  const getSignHeader = async (service, method) => {
    const rs = await window.axios.get('/upyun/cfg', { params: { size, method, filepath, md5 } });
    console.log(rs.data);
    return rs.data;
  };
  const client = new window.upyun.Client(service, getSignHeader);
  const result = await client.putFile(filepath, file);
  return { result, filepath };
};

(function($) {
  $.extend({
    uploader: function(zid, prefix, single, images, cb) {
      zid = zid === null ? '#appUploaderZone' : '#' + zid;

      function getImagesListItems() {
        var list = [];
        $.each($(zid).find('li img'), function(i, item) {
          list.push({ f: $(item).attr('data-key'), sort: i += 1 });
        });
        return list;
      }

      var flow = new Flow({
        target: '/uploader/' + prefix,
        singleFile: single,
        chunkSize: 1024 * 1024,
        testChunks: false
      });

      var flowlist = $(zid).find('.flow-list');
      var flowdrop = $(zid).find('.flow-drop');

      // Flow.js 兼容性检查
      if(!flow.support) {
        $(zid).find('.flow-error').show();
        return;
      } else $(zid).find('.flow-error').hide();

      if(images && images.length > 0) {
        var tpl = doT.template($('#upload-item-tpl').text());
        flowlist.show();
        $.each(images, function(i, img) {
          if(!img && img.length < 1) return;
          var html = $(tpl(img));
          flowlist.append(html);

          $(html.find('.upload-item-remove-btn')[0]).click(function(event) {
            html.remove();
            if(cb) cb(getImagesListItems());
          });
        });
      }

      // 多个文件
      if(single === false) {
        var sortableOptions = { sort: true, scroll: true, animation: 100, ghostClass: 'sortable-ghost', onEnd: function() { if(cb) cb(getImagesListItems()); } };
        var imgsSortable = new Sortable($(flowlist).get(0), sortableOptions);
      }

      // Show a place for dropping/selecting files
      if(flowdrop && flowdrop.length > 0) {
        flowdrop.show();
        flow.assignDrop(flowdrop[0]);
      }

      flow.assignBrowse($(zid).find('.flow-browse')[0]);
      flow.assignBrowse($(zid).find('.flow-browse-image')[0], false, false, { accept: 'image/*' });

      flow.on('filesAdded', function() {
        var progress = $(zid).find('.progress-bar');
        progress.css({ width: 0 });
        progress.attr('aria-valuenow', 0);
        $(zid).find('.flow-progress').show();
      });
      const enableBrowser = true;
      flow.on('filesSubmitted', (files, event) => {
        if(enableBrowser) {
          const { file } = files[0];
          uploadByClient(file).then((rs) => {
            const { result, filepath } = rs;
            console.log(rs);
            if(result) {
              flow.fire('fileSuccess', flow, {
                prefix: 'http://images.sp.yunjichina.com.cn/',
                key: filepath,
              });
            }
          });
        } else {
          flow.upload();
        }
      });

      flow.on('fileSuccess', function(file, message) {
        var data = message;
        var tpl = doT.template($('#upload-item-tpl').text());
        var html = $(tpl(data));
        var flowlist = $(zid).find('.flow-list');
        flowlist.show();
        if(single === true) {
          flowlist.html(html);
          if(cb) cb(data);
        } else {
          flowlist.append(html);
          if(cb) cb(getImagesListItems());
        }
      });

      flow.on('complete', function() {
        $(zid).find('.flow-list').imagesLoaded(function() { $(zid).find('.flow-progress').hide(); });
      });

      flow.on('fileProgress', function() {
        var progress = $(zid).find('.progress-bar');
        var number = Math.floor(flow.progress() * 100);
        progress.css({ width: number + '%' });
        progress.attr('aria-valuenow', number);
      });

      flow.on('fileError', function(file, message) {
        var error = $(zid).find('.flow-error');
        error.show();
        error.html(message);
      });

      flow.on('catchAll', function() {
        // FOR DEBUG
      });

      return flow;
    }
  });
})(jQuery);
