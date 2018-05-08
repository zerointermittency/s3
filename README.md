[![Build Status](https://travis-ci.org/zerointermittency/s3.svg?branch=master)](https://travis-ci.org/zerointermittency/s3)
[![Maintainability](https://api.codeclimate.com/v1/badges/c3afc1fac7199fbbc9d5/maintainability)](https://codeclimate.com/github/zerointermittency/s3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c3afc1fac7199fbbc9d5/test_coverage)](https://codeclimate.com/github/zerointermittency/s3/test_coverage)
[![npm version](https://badge.fury.io/js/%40zerointermittency%2Fs3.svg)](https://badge.fury.io/js/%40zerointermittency%2Fs3)
[![Downloads](https://img.shields.io/npm/dt/@zerointermittency/s3.svg)](https://www.npmjs.com/package/@zerointermittency/s3)
[![dependency status](https://david-dm.org/zerointermittency/s3.svg)](https://david-dm.org/zerointermittency/s3)
[![devDependency status](https://david-dm.org/zerointermittency/s3/dev-status.svg)](https://david-dm.org/zerointermittency/s3)

# Bienvenido

Este modulo es el encargado de proporcionar las funcionalidades para utilizar las características del servicio [S3][s3] de Amazon Web Services.

## Instalación

```bash
yarn add @zerointermittency/s3
# npm i --save @zerointermittency/s3
```

## Errores estandarizados

código | nivel | nombre      | mensaje
-------|-------|-------------|--------------
100    |fatal  |internal     |Internal error
101    |error  |notFound     |Not found
102    |error  |alreadyExist |Already exist

## Api

El modulo utiliza **[aws-sdk][aws-sdk]**, para poder utilizar todas las funcionalidades de [S3][s3] que están descritas en su [documentación][aws-sdk-s3].

##### Iniciar

Se instancia un objeto como se hace a continuación:

```javascript
const ZIS3 = require('@zerointermittency/s3'),
    s3 = new ZIS3(s3);
```

**Argumentos**:

- s3 \(*Object*\) **required**: es el objeto que recibe todas las [opciones del constructor de S3 del sdk de amazon][aws-sdk-s3-constructor-property]
    - bucket \(*String*\): es el **bucket** que utiliza por defecto el modulo para realizar los **crud**

> **bucket** es como amazon nombra el punto donde se almacenaran los archivos y carpetas

**Retorna**:

- \(*ZIS3*\): Retorna la instancia de la clase **ZIS3**.

##### Método **_head**

Este método permite saber si existe un elemento

```javascript
s3._head(key, bucket)
    .then(() => {})
    .catch((error) => {});
```

**Argumentos**:

- key \(*String*\): representa la ruta de destino del archivo o su identificador dentro del **bucket**
- bucket \(*String*\): nombre que identifica el **bucket**, por defecto **bucket en el constructor de ZIS3**

**Retorna**:

- \(*Promise*\):
    - then(): se ejecuta si el elemento existe
    - catch(error \[*Object*\]): error estandarizado

#### CRUD

Todas las operaciones de creación, lectura, actualización y eliminación para los archivos que se manipularan en [S3][s3]

##### Método **create**

Este método permite subir y crear un objeto en [S3][s3]

```javascript
s3.crud.create(opts)
    .then((data) => {})
    .catch((error) => {});
```

**Argumentos**:

- opts \(*Object*\) **required**:
    - key \(*String*\) **required**: representa la ruta de destino del archivo a subir y su identificador dentro del **bucket**
    - contentType \(*String*\) **required**: formato del archivo según [estandar][mime-types]
    - body \(*Buffer|ReadableStream|String*\) **required**: data del archivo
    - acl \(*String*\): tipo de acceso para el archivo, por defecto **public-read**. Otras opciones son:
        - private
        - public-read
        - public-read-write
        - authenticated-read
        - aws-exec-read
        - bucket-owner-read
        - bucket-owner-full-control
    - bucket \(*String*\): nombre que identifica el **bucket**, por defecto **bucket en el constructor de ZIS3**
    - storageClass \(*String*\): La clase de almacenamiento utilizada para almacenar el objeto, por defecto "STANDARD_IA":
        - STANDARD
        - REDUCED_REDUNDANCY
        - GLACIER
        - STANDARD_IA
        - ONEZONE_IA

> mas información sobre estas opciones en la [documentación][aws-sdk-s3]

**Retorna**:

- \(*Promise*\):
    - then(data \[*Object*\]):
        - location \(*String*\): enlace desde el cual se puede acceder al archivo
        - key \(*String*\): representa la ruta de destino del archivo o su identificador dentro del **bucket**
        - bucket \(*String*\): nombre que identifica el **bucket**
    - catch(error \[*Object*\]): error estandarizado

##### Metodo **read**

```javascript
s3.crud.read(key)
    .then((data) => {})
    .catch((error) => {});
```

**Argumentos**:

- key \(*String*\): representa la ruta de destino del archivo o su identificador dentro del **bucket**

**Retorna**:

- \(*Promise*\):
    - then(data \[*Object*\]):
        - contentType \(*String*\): formato del archivo según [estándar][mime-types]
        - body \(*Buffer*\): representa el archivo subido a[S3][s3]
        - lastModified \(*Date*\): fecha ultima modificación
    - catch(error \[*Object*\]): error estandarizado

##### Metodo **update**

```javascript
s3.crud.update(opts)
    .then(() => {})
    .catch((error) => {});
```

**Argumentos**:

- opts \(*Object*\) **required**:
    - key \(*String*\) **required**: representa la ruta de destino del archivo a subir y su identificador dentro del **bucket**
    - contentType \(*String*\): formato del archivo según [estándar][mime-types]
    - body \(*Buffer|ReadableStream|String*\) **required**: data del archivo
    - acl \(*String*\): tipo de acceso para el archivo, por defecto **public-read**. Otras opciones son:
        - private
        - public-read
        - public-read-write
        - authenticated-read
        - aws-exec-read
        - bucket-owner-read
        - bucket-owner-full-control
    - bucket \(*String*\): nombre que identifica el **bucket**, por defecto **bucket en el constructor de ZIS3**

**Retorna**:

- \(*Promise*\):
    - then(): se ejecuta cuando ha resultado la actualización correctamente
    - catch(error \[*Object*\]): error estandarizado

##### Metodo **delete**

```javascript
s3.crud.delete(key)
    .then(() => {})
    .catch((error) => {});
```

**Argumentos**:

- key \(*String*\): representa la ruta de destino del archivo o su identificador dentro del **bucket**

**Retorna**:

- \(*Promise*\):
    - then(): se ejecuta cuando se realizo la eliminación correctamente
    - catch(error \[*Object*\]): error estandarizado

## Pruebas funcionales (Unit Testing)

Se llevaron a cabo las pruebas funcionales para validar el funcionamiento de sus métodos y opciones por defecto:

> Importante: para realizar las pruebas se debe agregar el archivo las credenciales ```/test/config.js``` basándose en ```/test/config-sample.js```

```bash
yarn test
```

## Changelog

Todos los cambios importantes son escritos [aquí](CHANGELOG.md).

[s3]: https://aws.amazon.com/es/s3/
[aws-sdk]: https://www.npmjs.com/package/aws-sdk
[aws-sdk-s3]: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
[aws-sdk-s3-constructor-property]:http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
[npm-error]: https://bitbucket.org/smartbox_way/npm-error
[mime-types]:https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
[istanbul]: https://istanbul.js.org/