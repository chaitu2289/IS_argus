# argus

This repository includes code for the interactive GUI and communicate with backend server using Rabbitmq

Prerequisites:

Install Rabbitmq 

composer.json is in the repo. Execute "composer.phar install"

The above command is used to install "The php-amqplib client library". For any trouble please follow the instructions in "https://www.rabbitmq.com/tutorials/tutorial-one-php.html"

I have used Jcrop Image Cropping plugin. Please include path to Jcrop libraries.

https://github.com/tapmodo/Jcrop.git

Project Structure:

argus.js -> Creates interactive backend interface on the image uploaded. Jcrop is integrated.

index.php -> This is the simple GUI to learn features on input image

learn_featuers.py -> This is the intermediate file used to transfer GUI instruction to learn features from image to backend using rabbitmq

php2python.py     -> Transfers the input image to backend server to store and identify features in input images  
 
save.py           -> This is the intermediate file used to give save instruction from GUI to save image in PASCAL VOC format in py-faster-rcnn.

sender.php        -> Initializes rabbitmq objects to communicate to rabbitmq server.

modified_api.php  -> Received instructions from GUI (learn_features, save, identify_features) and calls corresponding python file to execute.

Software to install:

First install pip for python package manager.

sudo apt-get -y install python-pip

1) jaweson
pip install jaweson

2) pika
pip install pika

3) scipy packages
sudo apt-get install python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose

4) Install composer
Run this on command line

php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php
php -r "if (hash('SHA384', file_get_contents('composer-setup.php')) === '41e71d86b40f28e771d4bb662b997f79625196afcca95a5abf44391188c695c6c1456e16154c75a211d238cc3bc5cb47') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"

5) Run "php composer.phar install"
