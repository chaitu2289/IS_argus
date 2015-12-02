import sys
from jaweson import json
from PIL import Image
from pylab import *
import pika
import uuid

class RpcSender(object):
    def __init__(self):
	credentials = pika.PlainCredentials('guest', 'guest')

        self.connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', 5672, '/', credentials))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(self.on_response, no_ack=True,
                                   queue=self.callback_queue)

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(exchange='',
                                   routing_key='_argus_queue',
                                   properties=pika.BasicProperties(
                                         reply_to = self.callback_queue,
                                         correlation_id = self.corr_id,
                                         ),
                                   body=n)
        while self.response is None:
            self.connection.process_data_events()
        return self.response

def init():
	#print sys.argv[1]
	try:
        	inputFromPhp = json.loads(sys.argv[1])
	except Exception, e:
		print str(e)
		
        file_path = inputFromPhp['image_file_path']
	data = inputFromPhp['data']
	operation = inputFromPhp['operation']
        sender = RpcSender()
	try:
        	im = array(Image.open(file_path))
	except Exception, e:
		print str(e)
        msg = {"image_path" : file_path, "image" : im, "data" : data, "operation" : operation}
	#msg = {"image_path" : file_path, "data" : data}
        json_msg = json.dumps(msg)

        response = sender.call(json_msg)
        print response

if __name__ == "__main__":
        init()

