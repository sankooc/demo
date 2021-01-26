    1  yum -y update
    2  yum -y install epel-release python-pip
    3  pip install shadowsocks
    4  pip install --upgrade pip
    5  pip install shadowsocks
    6  vi /etc/shadowsocks.json
    7  ssserver -c /etc/shadowsocks.json -d start
    8  firewall-cmd --add-port=1515/tcp
    9  ssserver -c /etc/shadowsocks.json -d restart
   10  exit
   11  vi /etc/shadowsocks.json
   12  ssserver -c /etc/shadowsocks.json -d restart
   13  firewall-cmd --add-port=9998/tcp
   14  ssserver -c /etc/shadowsocks.json -d restart
   15  exit
   16  ssh root@108.61.163.85
   17  exit
   18  history
[root@vultr ~]#
[root@vultr ~]#
[root@vultr ~]#
[root@vultr ~]# cat /etc/shadowsocks.json
{ "server":"45.76.207.168", "server_port":9998, "password":"sankooc", "timeout":300, "method":"aes-256-cfb"}


yum -y update
yum -y install epel-release python-pip
pip install --upgrade pip
pip install shadowsocks

yum install epel-release -y
yum install libsodium -y
yum install python2-pip
pip2 install shadowsocks

yum install python-pip -y && pip install --upgrade pip && pip install shadowsocks


yum -y update && yum -y install epel-release libsodium python-pip && pip install --upgrade pip && pip install shadowsocks

echo '{ "server":"158.247.198.42", "server_port":3307, "password":"sankooc", "timeout":300, "method":"salsa20"}' >> /etc/shadowsocks.json

firewall-cmd --add-port=3307/tcp && ssserver -c /etc/shadowsocks.json -d start


http://aiui.yunjiai.cn/back/main
token:16f26cd21adab1f9
key:569ced5d4eb81c03
http://aiui.yunjiai.cn/back/mainNoMP3
token:d9dd569c2a5a6540
key:ba60b2d2fd7e1e6f

http://aiui.yunjiai.cn/back/YunFanCourt
token:e3c2b8415c6092d6
key:5a8d3ef2ed8d7000

http://aiui.yunjiai.cn/back/XinFangJu
token:2e0455f2b8120d51
key:dbefe9805b5cc399

http://aiui.yunjiai.cn/back/Cantonese
token:e5ec65c2ea8a32b9
key:c0a75d429d4b18aa

http://aiui.yunjiai.cn/back/4S
token:63e878b469d235e4
key:cc7bb9fb22a9627f

 db.flyos.insert({ scene: 'main', aesKey: '569ced5d4eb81c03', token: '16f26cd21adab1f9' })
 db.flyos.insert({ scene: 'mainNoMP3', aesKey: 'ba60b2d2fd7e1e6f', token: 'd9dd569c2a5a6540' })
 db.flyos.insert({ scene: 'YunFanCourt', aesKey: '5a8d3ef2ed8d7000', token: 'e3c2b8415c6092d6' })
 db.flyos.insert({ scene: 'XinFangJu', aesKey: 'dbefe9805b5cc399', token: '2e0455f2b8120d51' })
 db.flyos.insert({ scene: 'Cantonese', aesKey: 'c0a75d429d4b18aa', token: 'e5ec65c2ea8a32b9' })
 db.flyos.insert({ scene: '4S', aesKey: 'cc7bb9fb22a9627f', token: '63e878b469d235e4' })
 db.flyos.insert({"scene" : "nochat", "aesKey" : "90dd6da998624c1a", "token" : "e0db747fefa4b938"});


 db.flyos.insert({ scene: 'orderDishes', aesKey: '022b62c618f019dd', token: '096aa54a5d11c773' })

 db.flyos.update({scene: 'mainNoMP3'}, {$set: { aesKey: '87e690ea477489fd', token: '786e073b6d730e33' }}, { multi: false })

 db.flyos.update({scene: 'YunFanCourt'}, {$set: { aesKey: '4b0e6a029ae71a13', token: 'befa161f4661bc1e' }}, { multi: false })

 db.flyos.update({scene: 'XinFangJu'}, {$set: { aesKey: '9f33d21aff5c19cc', token: 'ae632cbdc7aad423' }}, { multi: false })


 db.flyos.update({scene: 'Cantonese'}, {$set: { aesKey: '9219137dd10e6241', token: 'd086eb76ec42e56e' }}, { multi: false })



 db.flyos.update({scene: '4S'}, {$set: { aesKey: 'fb58a9fd63bf77b0', token: '91288b394e711e68' }}, { multi: false })

 微信支付,certificate-兑换券支付
 兑换券支付
 优惠卷支付
 conAccout
 



 redis 批量del 
 ./redis-cli -h 127.0.0.1 -p 6379 keys "java_suisui*" | xargs ./redis-cli -h 127.0.0.1 -p 6379 del