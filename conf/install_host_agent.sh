echo 'Cloning telemetry git repo...'
cd /etc
git clone https://github.com/analyticsUfcg/cloud-telemetry.git
echo 'Done.'

echo 'Installing supervisor script...'
cd /etc/cloud-telemetry/conf
cp run_host_agent.sh /usr/local/bin
cp supervisor/host_agent.conf /etc/supervisor/conf.d
echo 'Done.'

echo 'Starting host agent...'
supervisorctl reread
supervisorctl update
supervisorctl start telemetry_host_agent
echo 'Done.'
