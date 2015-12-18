# argus

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
