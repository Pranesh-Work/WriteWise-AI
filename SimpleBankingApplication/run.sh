#!/bin/sh
set -e
mkdir -p out
javac -d out \
src/banking/model/Account.java \
src/banking/model/SavingsAccount.java \
src/banking/model/CheckingAccount.java \
src/banking/repository/AccountRepository.java \
src/banking/util/JsonUtil.java \
src/banking/util/CorsUtil.java \
src/banking/controller/AccountController.java \
src/banking/controller/TransactionController.java \
src/banking/Main.java
java -cp out banking.Main
