# Schwartze Ansingh Website

My project at https://www.schwartze-ansingh.com uses a spring boot backend and a vite react frontend. 
This repo contains the software for both. 


### Run Ansible playbook
```shell
ansible-playbook   ~/git/schwartze-ansingh/ansible/schwartze-site.yml --user=christine --ask-pass --extra-vars "ansible_become_pass=smn11dbvr"
```
