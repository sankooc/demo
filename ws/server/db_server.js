const async = require('async')
const url = 'mongodb://localhost:27017/tap';
const util = require('util')
const _ = require('lodash')

const events = require('events').EventEmitter;
const _eTable = new events.EventEmitter();

exports.on = _eTable.on.bind(_eTable);
exports.removeListener = _eTable.removeListener.bind(_eTable);

const _connect = (function(MongoClient) {
    let _status, _db;
    MongoClient.connect(url, function(err, db) {
        if (err) {
            _status = err;
        } else {
            _db = db;
        }
    });
    return function(callback) {
        if (_db) {
            return callback(null, _db);
        }
        callback(_status);
    }
})(require('mongodb').MongoClient);

function _mask(offset) {
    return 1 << offset;
}

function _broadcast(mid) {
    var eName = mid
    async.waterfall([function(callback) {
        exports.status({
            mid: mid
        }, callback);
    }, function(info, callback) {
        _eTable.emit(eName, info);
        callback(null, info);
    }], function() {
        //broadcast
    });
}

const _queue = async.queue(_create, 1);

function _create(option, callback) {
    async.waterfall([function(callback) {
        var _option = _.pick(option, 'mid');
        exports.status(_option, callback);
    }, function(info, callback) {
        if (_check(info.data, option.mask)) {
            _batch(option, callback);
        } else {
            callback('座位已被预订');
        }
    }, function(callback) {
        callback();
        _broadcast(option.mid);
    }], callback);
}

function _check(info, mask) {
    const keys = Object.keys(mask);
    for (let i = 0; i < keys.length; i++) {
        const row = keys[i]
        const _old = info[row]
        if (!_old) {
            continue;
        }
        const _new = mask[row]
        if (_new & _old) {
            return false;
        }
    }
    return true;
}

// function _check(option,callback){
//     const _movie = _cache[mid] || {};
//     const {mid,items,mask} = option;
//     if(mask){
//         const keys = Object.keys(mask);
//         for(let i =0;i<keys.length;i++){
//             const row = keys[i]
//             const _old = _movie[row]
//             if(!_old){
//                 continue;
//             }
//             const _new = mask[row]
//             if(_new&_old){
//                 return false;
//             }
//         }
//         _.each(mask,function(_new,row){
//             let _old = _movie[row] || 0;
//             _old |= _new;
//             _movie[row] = _old;
//         });
//     }
//     _cache[mid] = _movie;
//     return true;
// }

// function _check_and_add(option,callback){
//     const _movie = _cache[mid];
//     // if(){}
// }

// function _remove(option){
//     const {mid,mask} = option;
//     const _movie = _cache[mid] || {};
//     if(mask){
//         _.each(mask,function(_new,row){
//             let _old = _movie[row] || 0;
//             _old ^= _new;
//             _movie[row] = _old;
//         });
//     }
//     _cache[mid] = _movie;
// }

function _wrap(option) {
    const {items} = option;
    if (items) {
        option.mask = _.reduce(items, (memo, item) => {
            let _x = memo[item.x] || 0;
            const mask = 1 << item.y;
            _x |= mask;
            memo[item.x] = _x;
            return memo;
        }, {});
    }
}

// exports.create = function(option, callback) {
//     async.waterfall([_connect, function(db, callback) {
//         var tid = util.format('%s-%s-%s', option.mid, option.hinx, option.vinx)
//         var query = {
//             tid: tid
//         };
//         var modify = {
//             $setOnInsert: {
//                 tid: tid,
//                 uid: option.uid,
//                 mid: option.mid,
//                 vinx: _mask(option.vinx),
//                 hinx: option.hinx
//             }
//         }
//         var collection = db.collection('ticket');
//         collection.findAndModify(query, [], modify, {
//             upsert: true
//         }, function(err, doc) {
//             if (err) {
//                 callback(err);
//                 return console.trace(err.stack);
//             }
//             if (doc) {
//                 if(doc.value){
//                     callback('已经被占用')
//                 }else{
//                     callback();
//                     _broadcast(option.mid);
//                 }
//             } else {
//                 callback('unknown');
//             }
//         });
//     }], callback);
// }


function _batch(option, callback) {
    const {
        mid,
        uid,
        items
    } = option;
    async.waterfall([_connect, function(db, callback) {
        async.each(items, function(item, callback) {
            const tid = util.format('%s-%s-%s', mid, item.x, item.y)
            const query = {
                tid: tid
            };
            const modify = {
                $setOnInsert: {
                    tid,
                    uid,
                    mid,
                    vinx: _mask(item.y),
                    hinx: item.x
                }
            }
            var collection = db.collection('ticket');
            collection.findAndModify(query, [], modify, {
                upsert: true
            }, function(err, doc) {
                if (err) {
                    callback(err);
                    return console.trace(err.stack);
                }
                if (doc) {
                    if (doc.value) {
                        callback('已经被占用')
                    } else {
                        callback();
                    }
                } else {
                    callback('unknown');
                }
            });
        }, callback);
    }], callback);
}

exports.batch = function(option, callback) {
    _wrap(option);
    _queue.push(option, callback);
}

exports.cancel = function() {}



// function updateCache(db,callback){
//     async.waterfall([function(callback) {
//         console.log('-');
//         var collection = db.collection('ticket');
//         var _project = {
//             $project: {
//                 mid: 1
//                 ,vinx:1
//                 ,hinx:1
//             }
//         }
//         var _group = {
//             $group: {
//                 _id: '$mid',
//                 vmask: {
//                     $sum: "$vinx"
//                 }
//             }
//         }
//         collection.aggregate([_project,_group], callback);
//     },function(result,callback){
//         console.log('1');
//         console.log(JSON.stringify(result));
//         // var _r = _.reduce(result,function(memo,item){
//         //     memo[item._id] = item.vmask;
//         //     return memo;
//         // },{});
//         callback(null,result);
//     }], callback);
// }

// function _status(option, callback){
//     async.waterfall([_connect, function(db, callback) {
//         var collection = db.collection('ticket');
//         var _project = {
//             $project: {
//                 mid: 1
//                 ,uid:1
//                 ,vinx:1
//                 ,hinx:1
//             }
//         }
//         var _match = {
//             $match: _.pick(option,'uid','mid')
//         }
//         var _group = {
//             $group: {
//                 _id: {
//                     uid: "uid"
//                     ,row: "$hinx"
//                 },
//                 vmask: {
//                     $sum: "$vinx"
//                 }
//             }
//         }
//         collection.aggregate([_project,_match,_group], callback);
//     },function(result,callback){
//         var _r = _.reduce(result,function(memo,item){
//             memo[item._id] = item.vmask;
//             return memo;
//         },{});
//         callback(null,_r);
//     }], callback);
// }

exports.status = function(option, callback) {
    async.waterfall([_connect, function(db, callback) {
        var collection = db.collection('ticket');
        var _project = {
            $project: {
                mid: 1,
                uid: 1,
                vinx: 1,
                hinx: 1
            }
        }
        var _match = {
            $match: _.pick(option, 'uid', 'mid')
        }
        var _group = {
            $group: {
                _id: {
                    uid: "$uid",
                    row: "$hinx"
                },
                vmask: {
                    $sum: "$vinx"
                }
            }
        }
        collection.aggregate([_project, _match, _group], callback);
    }, function(result, callback) {
        const _result = _.reduce(result, function(memo, item) {
            const uid = item._id.uid;
            const row = item._id.row;
            const mask = item.vmask;
            memo.data[row] = memo.data[row] || 0;
            memo.data[row] += mask;
            memo.user[uid] = memo.user[uid] || {};
            memo.user[uid][row] = memo.user[uid][row] || 0;
            memo.user[uid][row] += mask;
            return memo;
        }, {
            data: {},
            user: {}
        });
        callback(null, _result);
    }], callback);
}
