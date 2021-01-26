current=`date +%s`
filename1=andrew${current}.gzip
filename2=order${current}.gzip
ssh cshupeng@49.235.90.210 -i /Users/yj431/.ssh/cshupeng << EOF
  cd backup
  mongodump -h 127.0.0.1 -d andrew --gzip --archive=$filename1
  mongodump -h 127.0.0.1 -d order  --gzip --archive=$filename2
  exit
EOF
scp -i /Users/yj431/.ssh/cshupeng cshupeng@49.235.90.210:/home/cshupeng/backup/${filename1} ./
scp -i /Users/yj431/.ssh/cshupeng cshupeng@49.235.90.210:/home/cshupeng/backup/${filename2} ./
# mongorestore -d andrew --gzip --archive=${filename1}
# mongorestore -d order --gzip --archive=${filename2}
ssh cshupeng@49.235.90.210 -i /Users/yj431/.ssh/cshupeng <<+
  cd backup
  rm $filename1
  rm $filename2