var router = require('express').Router(),
    logger = require('../util/log').logger('routes_boraocast'),
    model_broadcast = require('../model/broadcast'),
    moment = require('moment-timezone')

var post_broadcast = function (req, res) {
    var user_id = req.session.user_id
    var content = req.param('content')

    if (user_id === undefined || content === undefined) {
        return res.redirect('back')
    }

    var args = {
        user_id: user_id,
        content: content
    }
    
    model_broadcast.insert(args, function (err, rows) {
        if (err) {
            logger.error('insert broadcast failed. user_id:' + user_id)
            return res.render('error.jade', err)
        }

        return res.redirect('/broadcast_list')
    })
}

var update_broadcast = function (req, res) {
    var user_id = req.session.user_id
    var id = req.param('id')
    var content = req.param('content')

    if (user_id === undefined || id === undefined || content === undefined) {
        return res.redirect('back')
    }

    var args = {
        user_id: user_id,
        id     : id,
        content: content
    }

    model_broadcast.update(args, function (err, rows) {
        if (err) {
            logger.error('update broadcast failed. id :' + id)
            return res.render('')
        }
    })
}

var del_broadcast = function (req, res) {
    var user_id = req.session.user_id
    var id = req.param('id')

    if (user_id === undefined || id === undefined) {
        return res.redirect('back')
    }

    var args = {
        user_id: user_id,
        id     : id
    }

    model_broadcast.update(args, function (err, result) {
        if (err) {
            logger.error('delete album failed. id : ' + id)
            return res.redirect('back')
        }

        return res.render('')
    })
}

var list_broadcast = function (req, res) {
    var user_id = req.session.user_id

    if (user_id === undefined) {
        return res.redirect('back')
    }
    
    model_broadcast.list({user_id: user_id}, function (err, rows) {
        if (err) {
            logger.error('get album list failed. user_id :' + user_id)
            return res.redirect('back')
        }

        var length = rows.length
        for (var i = 0 ; i < length ; i++) {
            rows[i].post_time = moment(rows[i].post_time).format('YYYY-MM-DD HH:mm')
        }
        return res.render('broadcast/broadcast', {tweets: rows})
    })
}

router.post('/post_broadcast', post_broadcast)
router.post('/update_broadcast', update_broadcast)
router.post('/del_broadcast', del_broadcast)
router.get('/broadcast_list', list_broadcast)
module.exports = router