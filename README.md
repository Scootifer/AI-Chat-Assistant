Welcome to my AI Assistant react project!

TLDR;
This project began out of my personal curiosity to run an llm locally, utilize automation through n8n, and gain a better understanding of REACT webapps.
In just a few short days this project took off in idea and potential. This is the beginning version of it to be shared with the world as a simple starting point for your own AI LLM chat service.

Setup;
Clone the repo. \n
Fill in the .env file .n
Build with docker. "docker compose up --build". \n
You will need to download the model of your chosing through the ollama service in the docker instance. NOTE: Models other than llama3 will require some manual code fixing. \n

Your webapp can be found at http://localhost:3000 \n
Ollama can be contacted at http://ollama:14343/api/generate with POST requests \n
n8n can be access at http://localhost:5678 it is my favorite tool in the suite \n

NOTE: POSTgresdb and cloaker are installed should you chose to move to a multi-user setup. Initially planned for my project pushed to a later production time.



Continuation;
I still develop this application as a private project in my freetime where I use multiple agents to complete code tasks. Private demos can be shown as requested.
