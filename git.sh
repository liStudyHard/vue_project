WORK_DIR="/home/www/work/h5"
DEPLOY_DIR="/home/www/deploy/h5"
BRANCH="master"
CDN="yes"
PROJECT="taofen8_h5"

get_code(){
    if ! [ -d $PROJECT ]; then
        git clone git@gitlab.taofen8.com:taofen8_h5/$PROJECT.git
        #chown -R $SUDO_USER $WORK_DIR/$PROJECT
    fi

    cd $PROJECT
    git checkout master
    git branch -D deploy
    git fetch

    for i in `git tag`
    do
        echo $i
        if [ $i = $BRANCH ];then
            git checkout -b deploy $BRANCH
            return
        fi
    done

    echo "Tag not found! Only tag can deploy!!!"
    exit 1
}

read -p "Please input the project [taofen8_h5|app|act|market] [taofen8_h5 is default]:" PROJECT
if [ -z $PROJECT ]; then
    PROJECT="taofen8_h5"
fi

read -p "Please input the tag:" BRANCH
if [ -z $BRANCH ]; then
    BRANCH="master"
fi

if ! [ -d $WORK_DIR ]; then
    mkdir $WORK_DIR
fi

cd $WORK_DIR

get_code

npm i --unsafe-perm

read -p "Whether or not to use CDN? [yes|no][yes is default]:" CDN
if [ -z $CDN ]; then
    CDN="yes"
fi

if [ $CDN = "yes" ]; then
    npm run build-cdn
    npm run upload
else
    npm run build
fi


if ! [ -d $DEPLOY_DIR ]; then
    mkdir $DEPLOY_DIR
fi

if ! [ -d $DEPLOY_DIR/$PROJECT ]; then
    mkdir $DEPLOY_DIR/$PROJECT
fi

cp -rf ./dist/static $DEPLOY_DIR/$PROJECT/
cp -f ./dist/index.html $DEPLOY_DIR/$PROJECT/

exit 0


