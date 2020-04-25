#! /bin/bash

# Author: Fabrice B. Mpogazi
#
# Intent:
#   This file should contain a script that 
#   installs all the necessary software.
#   Among them is redis, npm, mongodb, npm 
#   packages. And also should help with 
#   setting up environment variables for the
#   different environment types.
#   In addition, it should set up permissions
#   to the different files especially in 
#   the production stage of the process.

#setting up your environment

# echo "Wait as we set up your env!\n"
# echo "MySql hostname: \n"
# read hostname
# echo "MySql username: \n"
# read username
# echo "MySql password: \n"
# read -sp password
# echo "MySql dbname: \n"
# read dbname

# echo "export BOWEN_MYSQL_HOSTNAME='$hostname'" >> ~/.bashrc
# echo "export BOWEN_MYSQL_USERNAME='$username'" >> ~/.bashrc
# echo "export BOWEN_MYSQL_PASSWORD='$password'" >> ~/.bashrc
# echo "export BOWEN_MYSQL_DBNAME='$dbname'" >> ~/.bashrc

# run this to start the redis-server
# redis-server --daemonize yes
# It runs the process as a daemon