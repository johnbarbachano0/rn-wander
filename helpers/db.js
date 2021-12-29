import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("wander.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMART KEY NOT NULL ,title TEXT NOT NULL,description TEXT NOT NULL, visitAt DATE NOT NULL, image TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lon REAL NOT NULL, createdBy TEXT NOT NULL, createdAt DATE NOT NULL, updatedAt DATE NOT NULL );",
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const insertPlace = (
  id,
  title,
  description,
  visitAt,
  address,
  createdBy,
  createdAt,
  updatedAt,
  image,
  lat,
  lon
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO places (id,title, description,visitAt,address,createdBy,createdAt,updatedAt,image,lat,lon) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [
          id,
          title,
          description,
          visitAt,
          address,
          createdBy,
          createdAt,
          updatedAt,
          image,
          lat,
          lon,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const dropTable = (tableName) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE ${tableName}`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const checkTables = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT name FROM places WHERE type="table" ORDER BY name`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};
