pipeline {
    agent any
    environment {
		def GET_BASE = 'ecash-front'
        def GIT_NAME = 'vue-admin-backend-v3'
        TAG = """${sh(
                returnStdout: true,
                script: "date +%m%d-%H%M"
        )}"""
        def DOCKER_IMAGE_NAME = "${ecash_env}-admin-backend"

    }
    stages {
        // 下载代码
        stage('checkout') {
            steps {
                echo "代码分支为：${branch} ${GET_BASE}/${GIT_NAME}"
                checkout([$class: 'GitSCM', branches: [[name: '${branch}']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'gitaccount', url: "https://g.qapple.io/${GET_BASE}/${GIT_NAME}.git"]]])
            }
        }
        // 推送docker
        stage('docker') {
            steps {
			  sh '''
                rm -rf node_modules/
                rm -rf dist/
				tar xzf nginx-1.12.2.tar.gz

				if [ "${ecash_env}" == "pro" ]; then
                  /bin/bash /data/rancher/script/aws-auth-image.sh push
				  sleep 5
			      /bin/bash /data/rancher/script/aws-auth-image.sh pull
			    fi
        source /etc/profile.d/node.env.sh
        npm install --unsafe-perm=true
        cd script/ && bash run.sh ${ecash_env} build && cd ../
				docker build -t ${aws_container_addr}/${DOCKER_IMAGE_NAME}:${TAG} .
        docker push ${aws_container_addr}/${DOCKER_IMAGE_NAME}:${TAG}
        docker rmi  ${aws_container_addr}/${DOCKER_IMAGE_NAME}:${TAG}
				rm -rf nginx* Dockerfile
			  '''
            }
        }
	}
}

