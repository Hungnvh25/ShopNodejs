'use strict'

const shopModel = require("../models/shop.model")
const bycrypto = require('bcrypt')
const crypto = require('crypto')
const KeyTokenServices = require("./keyToken.services")
const { createTokenPair } = require("../auth/authUtils")
const { token } = require("morgan")
const { getInfoData } = require("../utils")

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async({name, email, password}) => {
        try {
            // step 1 check email exists?
            const holderShop = await shopModel.findOne({ email }).lean()

            if(holderShop){
                return {
                    code: 'xxxx',
                    message: 'Email already exists',
                    status: 'error'
                }
            }

            const passwordHash = await bycrypto.hash(password,10)
            const newShop = await shopModel.create({
                name,email,password : passwordHash,roles:[roleShop.SHOP]
            })
            
            console.log('password::',password);
            console.log('passwordHash::',passwordHash);

            if(newShop){
  
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({privateKey, publicKey}); // save collection keyStore

                const KeyStore = await KeyTokenServices.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!KeyStore){
                    return {
                        code: 'xxxx',
                        message: 'KeyStore error',
                        status: 'error'
                    }
                }

                // created token pair
                const tokens = await createTokenPair({userId: newShop._id,email},publicKey,privateKey)

                console.log('Created token Success::',tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id','name', 'email'],object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService