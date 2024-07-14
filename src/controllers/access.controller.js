'use strict'

const AccessService = require("../services/access.service")
const { validationResult } = require('express-validator')

class AccessController{
    signUp = async(req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            console.log('[P]::signUp::',req.body)
            return res.status(201).json(await AccessService.signUp(req.body))
        } catch (error) {
            next(error) 
        }
    }
}

module.exports = new AccessController()