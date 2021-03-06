var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_blog')

exports.insert = function (args, cb) {
    var sql = 'insert into blog(user_id, category_id, title, content, update_time) values(?, ?, ?, ?,now());'
    var inserts = [args.user_id, args.category_id, args.title, args.content]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error("Insert blog failed. user_id :" + args.user_id)
                return {ok : 0}
            }

            cb(err, rows)
            conn.release()
        })
    })
}

exports.update = function (args, cb) {
    var sql = 'update blog set category_id = ?,title=?,content=?,update_time=now() where id = ?;'
    var inserts = [args.category_id, args.title, args.content, args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.get_by_id = function (args, cb) {
    var sql = 'select id, user_id, category_id, title, content, post_time, update_time from blog where id = ?;\
               select review.id, type, review_id, user_id, content ,review_time, user_info.nickname,user_info.photo from review \
               inner join user_info on review.user_id = user_info.id where review_id = ? and type = ? \
               order by review_time desc;'
    var inserts = [args.id, args.review_id, args.type]
    sql = mysql.format(sql, inserts)
    logger.info('sql : ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error('get blog failed , blog_id :' + args.id)
            }
            cb(err, rows)
            conn.release()
        })
    })
}

exports.get_list_by_user = function (args, cb) {
    var sql = 'select id, user_id, category_id,\
               title, content, post_time, update_time\
               from blog where user_id = ?'
    var inserts = [args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.get_list_by_category = function (args, cb) {
    var sql = 'select id, user_id ,category_id, \
               title, content , post_time , update_time\
               from blog where category_id = ? '
    var inserts = [args.category_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}   

exports.get_blog_by_title = function (args, cb) {
    var sql = 'select id, user_id ,category_id,title, content , post_time , update_time\
               from blog where title like ? and user_id = ?'
    var inserts = ['%' + args.title + '%', args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.del = function (args, cb) {
    var sql = 'delete from blog where id = ? ;'
    var inserts = [args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql : ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error('delete blog failed , blog_id :  ' + args.id)

            }

            cb(err, rows)
            conn.release()
        })
    })
}
