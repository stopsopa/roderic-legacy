
rmdir /s/q linked

echo "creating dir 'linked'"
mkdir linked

echo "creating symlink 'linked/example'"
cd linked
mklink /D example "..\dir-to-link"
cd ..




