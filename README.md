# domofon-dom38

https://domofon.dom38.ru/n/

Чтобы развернуть проект, необходимо:

1. Клонировать репозиторий на свой компьютер (`git clone https://github.com/topsite-studio/domofon-dom38.git`)
2. Установить все зависимости проекта (`npm install`)
3. Произвести первую сборку проекта
```
gulp build
```
Таск `build` запускает сборку всех файлов **с минимизацией JS, CSS, HTML, изображений и т.д.**

Чтобы запустить мини-сервер с сайтом _для разработки_, необходимо прописать в терминале
```
gulp dev
```
Таск `dev` запустит сборку всех файлов проекта **без минимизации**.

Аналогичный таск со сборкой файлов *с минимизацией*:

```
gulp default
```
