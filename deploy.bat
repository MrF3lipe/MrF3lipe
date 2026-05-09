@echo off
echo ============================================
echo  CONSTRUYENDO PORTFOLIO PARA GITHUB PAGES
echo ============================================
echo.

echo [1/2] Ejecutando pnpm build...
call pnpm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo la construccion. Revisa los mensajes anteriores.
    pause
    exit /b %errorlevel%
)
echo.

echo [2/2] Copiando carpeta dist a docs...
if exist docs (
    echo Eliminando carpeta docs existente...
    rmdir /s /q docs
)
xcopy dist docs /E /I
if %errorlevel% neq 0 (
    echo ERROR: Fallo la copia de archivos.
    pause
    exit /b %errorlevel%
)
echo.

echo ============================================
echo  LISTO. Ahora haz commit y push a main.
echo  Luego configura GitHub Pages:
echo    Settings - Pages - Branch: main / folder: docs
echo ============================================
pause