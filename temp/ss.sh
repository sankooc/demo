ssh ec2-user@$1 <<+
    cd $prog
    cd ~
    pm2 reload $prog
tail /var/log/$prog/node.log