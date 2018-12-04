## Compatible-Storage
> Support all browser and Wechat mini program.
> Quick to set, get and remove the storage.

### Install
```
npm i -save compatible-storage
// or
yarn add compatible-storage
```

### Import
```
import StorageUtils from 'compatible-storage';
```

### Usage
```
// Set by default expire time. Default: 30 days.
StorageUtils.set('storage-key', { ...data...});

// Custom expire time. eg: 2 hours.
StorageUtils.set('storage-key', { ...data...}, new StorageUtils.Expire(2, this.EXPIRE_UNIT.HOUR));

// Get
const value = StorageUtils.get('storage-key');

// Remove
StorageUtils.remove('storage-key');
```
