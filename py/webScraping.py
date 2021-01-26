import requests
import json
import time

thistime = int(time.time())
urlLogin = "http://www.kuaihuiyi.com/eeos_admin/login.php?return=/eeos_admin/admin.php"
urlData = "http://www.kuaihuiyi.com/saasajax/finance.ajax.php?action=getAllMeetingOrderList"
headers = {
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36"
}
payload = {"thistime":thistime, "admin_username":"liwenhe","admin_password":"KHD1207#lwh"}

## log in 
session = requests.Session()
reqLogin = session.post(urlLogin,data=payload)
print(reqLogin)



params = {
"action":"getAllMeetingOrderList",
"searchJson": """{"startTimestamp":1587916800,"endTimestamp":1588003199,"orderTypeStr":"1,1001,1002,2001,2007,2018","statusStr":"0","page":"1","perpage":20,"orderId":"","description":"","schoolProperty":"0","schoolAccount":""}"""
}
## get data
session.headers["Content-Type"] = "application/x-www-form-urlencoded"
reqData = session.post(urlData,data=params)

# print(session.headers)
# print(session.cookies)

print(reqData.text.encode("utf-8").decode('unicode_escape'))

