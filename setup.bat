@echo off
title AgencyHub - Setup
echo ========================================
echo  AgencyHub - Setup Automatico
echo ========================================
echo.

echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado! Instale em: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js OK
echo.

echo Instalando pnpm...
npm install -g pnpm
echo.

echo ========================================
echo  BACKEND - npm install
echo ========================================
cd /d "%~dp0backend"
echo Pasta: %cd%
echo.
npm install
echo Codigo de saida npm install: %errorlevel%
echo.

echo ========================================
echo  BACKEND - migration
echo ========================================
npm run migration:run
echo Codigo de saida migration: %errorlevel%
echo.

echo ========================================
echo  BACKEND - seed
echo ========================================
npm run seed
echo Codigo de saida seed: %errorlevel%
echo.

echo ========================================
echo  FRONTEND - pnpm install
echo ========================================
cd /d "%~dp0frontend"
echo Pasta: %cd%
echo.
pnpm install
echo Codigo de saida pnpm install: %errorlevel%
echo.

echo ========================================
echo  SETUP FINALIZADO - veja os codigos acima
echo  Codigo 0 = sucesso, outro = erro
echo ========================================
echo.
pause
