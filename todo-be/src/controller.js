const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { nanoid } = require('nanoid')

const adapter = new FileSync('data/db.json');
const db = low(adapter);

exports.getAll = (req, res) => {
    setTimeout(() => {
        const posts = db.get('tasks')
            .sortBy('createdDate')
            .reverse()
            .value();
        res.send(posts);
    }, 3000);
};

exports.getCompleted = (req, res) => {
    const posts = db.get('tasks')
        .filter((item) => item.completed)
        .sortBy('createdDate')
        .reverse()
        .value();
    res.send(posts);
};

exports.create = (req, res) => {
    if (!req.body.text) {
        res.status(422).send('\'text\' field must be present in json');
    } else {
        const written = db.get('tasks')
            .push({
                id: nanoid(),
                text: req.body.text,
                completed: false,
                createdDate: new Date().getTime(),
            })
            .last()
            .write();
        res.send(written);
    }
};

exports.deleteAllCompleted = (req, res) => {

    const deleted = db
      .get('tasks')
      .remove({ completed: true })
      .write();

    res.send({ success: true, deletedCount: deleted.length });
  };

exports.delete = (req, res) => {
    const id = req.params['id'];
    if (!id) {
        res.status(422).send('\'id\' must be present in params');
    } else {
        const deleted = db.get('tasks')
            .remove({id})
            .write();
        if (deleted.length === 0) {
            res.status(404).send('id not found, nothing to delete');
        } else {
            res.send();
        }
    }
};

exports.updateText = (req, res) => {
    const {text} = req.body;
    const id = req.params['id'];
    if (!text) {
        res.status(422).send('\'text\' field must be present in json');
    } else if (!id) {
        res.status(422).send('\'id\' must be present in params');
    } else {
        const written = db.get('tasks')
            .find({id})
            .assign({text})
            .write();
        res.send(written);
    }
};

exports.completeAll = (req, res) => {
    const { ids } = req.body;
    if (!ids) {
      return res.status(422).send("'ids' field must be present in json");
    }

    const completed = db.get('tasks')
      .filter((item) => !item.completed && ids.includes(item.id))
      .forEach((item) => {
        item.completed = true;
        item.completedDate = new Date().getTime();
      })
      .write();

    res.send(completed);
  };

  exports.incompleteAll = (req, res) => {
    const { ids } = req.body;
    if (!ids) {
      return res.status(422).send("'ids' field must be present in json");
    }
    const incompleted = db.get('tasks')
      .filter((item) => item.completed && ids.includes(item.id))
      .forEach((item) => {
        item.completed = false;
        item.completedDate = undefined;
      })
      .write();

    res.send(incompleted);
  };

exports.complete = (req, res) => {
    const id = req.params['id'];
    if (!id) {
        res.status(422).send('\'id\' must be present in params');
    } else {
        const completed = db.get('tasks')
            .find({
                id,
                completed: false,
            })
            .assign({
                completed: true,
                completedDate: new Date().getTime(),
            })
            .write();
        if (!completed.id) {
            res.status(404).send('id not found or trying to complete already completed item');
        } else {
            res.send(completed);
        }
    }
};


exports.incomplete = (req, res) => {
    const id = req.params['id'];
    if (!id) {
        res.status(422).send('\'id\' must be present in params');
    } else {
        const incompleted = db.get('tasks')
            .find({
                id,
                completed: true,
            })
            .assign({
                completed: false,
                completedDate: undefined,
            })
            .write();
        if (!incompleted.id) {
            res.status(404).send('id not found or trying to incomplete not completed item');
        } else {
            res.send(incompleted);
        }
    }
};

