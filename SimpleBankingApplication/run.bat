@echo off
setlocal
if not exist out mkdir out
echo Compiling Java backend...
javac -d out src\banking\model\Account.java src\banking\model\SavingsAccount.java src\banking\model\CheckingAccount.java src\banking\repository\AccountRepository.java src\banking\util\JsonUtil.java src\banking\util\CorsUtil.java src\banking\controller\AccountController.java src\banking\controller\TransactionController.java src\banking\Main.java
if errorlevel 1 (
    echo.
    echo Compilation failed.
    pause
    exit /b 1
)
echo Starting server at http://localhost:8080
java -cp out banking.Main
