# Installer Tesseract et les langues
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-fra tesseract-ocr-eng

# Vérifier l'installation
tesseract --version

# Tester
tesseract --list-langs