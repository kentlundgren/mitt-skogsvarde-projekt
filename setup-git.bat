@echo off
echo Setting up Git remote...
git remote remove origin
git remote add origin https://github.com/kentlundgren/mitt-skogsvarde-projekt.git
git remote -v
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo Done!
pause 