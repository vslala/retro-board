username=$1
password=$2
server=$3
registry=$4
registry_token=$5
registry_image=$6

echo "Registry Token: ${registry_token}"
echo "Registry: ${registry}"
echo "Registry Image: ${registry_image}"

sshpass  -p "${password}" ssh -o StrictHostKeyChecking=no "${username}"@"${server}" <<-'ENDSSH'
  ssh ${username}@${server} sudo docker pull "${registry}:${registry_image}"
  ssh ${username}@${server} sudo docker run -d --rm --name retro-board -p 3000:3000 ${registry_image}
ENDSSH