username=$1
password=$2
server=$3
registry_token=$4

repository=$(echo "$registry_token" | cut -d ':' -f 1)
registry_image=$(echo "$registry_token" | cut -d ':' -f 2)

container="its-retro"


echo "Registry Token: ${registry_token}"

sshpass  -p "${password}" ssh -tt -o StrictHostKeyChecking=no "${username}"@"${server}" "echo $HOME -> $repository"
sshpass  -p "${password}" ssh -tt -o StrictHostKeyChecking=no "${username}"@"${server}" "docker images | grep $repository | awk '{print $3}'"
sshpass  -p "${password}" ssh -tt -o StrictHostKeyChecking=no "${username}"@"${server}" "docker container stop $container"
sshpass  -p "${password}" ssh -tt -o StrictHostKeyChecking=no "${username}"@"${server}" "docker rmi -f $(docker images | grep "$repository" | awk '{print $3}')"
sshpass  -p "${password}" ssh -tt -o StrictHostKeyChecking=no "${username}"@"${server}" "docker pull $registry_token"
sshpass  -p "${password}" ssh -tt -o StrictHostKeyChecking=no "${username}"@"${server}" "docker run -d --rm --name $container -p 3000:80 $registry_token"
