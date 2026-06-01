#!/usr/bin/env sh

set -e
npm run build

cd dist

# 如果已存在 .git 文件夹，先删除
if [ -d ".git" ]; then
  rm -rf .git
fi

git init
git config user.name "zhangquanming"
git config user.email "419654548@qq.com"
git add -A
git commit -m 'deploy'

# 先添加远程仓库，再推送
git push -f git@github.com:zhangquanming/zhangquanming.github.io.git master

cd -
