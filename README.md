# SMS Gate - смс шлюз под модемы huawei

сервис использует api модема для отправки смс сообщений, сервис выглядит как прокладка между его упрощенным API и модемом. Сервис умеет:
- отправлять сообщение
- формировать отчет об отправке смс сообщений
- логировать запросы

логи хранятся в каталоге `logs`
отчеты хранятся в каталоге `report`

Проект разворачивается в две команды:
1) git clone https://git.m2ss.ru/developers/sms-gate-js
2) npm install
3) forever start sms-gate.js

перед запуском (пункт 3) нужно настроить `.env` конфиг , для этого его нужно создать, а значения конфига можно взять из файла `example.env`:

#### API_KEY - апи ключ, который используется в ссылке

#### APP_HOST - хост сервиса
#### APP_PORT - port сервиса

#### HUAWEI_MODEM_HOST - хост модема (модем должен дать свою внутреннюю подсеть, обычно это `192.168.8.1`)
#### HUAWEI_MODEM_PORT - port модема (по умолчанию стандартный)

- [x] работаeт на модемах huawei 
- [x] $${\color{red}NEW}$$ сервис подходит для свежеобновленных модемов серии LTE Dongle E3372-325 
