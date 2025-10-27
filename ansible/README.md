# Ronin Ansible Deployment

This playbook provisions a Ronin Ubuntu 22.04 VM and deploys Cyber_Minibus.
It follows the steps in `deployment_guideline.txt`, but automates:

- Install Node.js 20, Git, Docker + compose plugin
- Clone repo to `~/Cyber_Minibus`
- Create `.env` files from templates
- Start MongoDB via Docker Compose
- Install server/client dependencies and (optionally) build client
- Seed the database (idempotent) and run backend with systemd

## Files
- `ansible/inventory.ini` — example inventory
- `ansible/deploy-ronin.yml` — main playbook
- `ansible/templates/server.env.j2` — server `.env` template
- `ansible/templates/client.env.j2` — client `.env` template
- `ansible/templates/minibus-server.service.j2` — systemd unit
 

## Usage
1) Update inventory with your Ronin host and SSH key:
   - `ansible/inventory.ini`

2) Provide/override variables as needed:
   - Edit `ansible/deploy-ronin.yml` vars section, or pass with `-e`.
   - At minimum, set `jwt_secret`.

3) Run the playbook:
```
ansible-playbook -i ansible/inventory.ini ansible/deploy-ronin.yml
```

## Notes
- Backend runs as `systemd` service: `minibus-server` on port 3000.
- MongoDB runs in Docker (from repo `docker-compose.yml`).
- Client build is optional (`client_build: false` by default). If enabled,
  you can serve it with your preferred method (e.g., Nginx) from `client/dist`.
 
