var _ = require('lodash');
var restaurantService = require('../services').restaurantService;
var Validator = require('validatorjs');

const insertRestaurant = async ( req, res, next ) => {

    try {

        let body = req.body;
        let rules = {
            restaurant_name: 'required',
            restaurant_addr: 'required'
        };
        
        let validation = new Validator( body, rules );
        if( validation.fails() ) {
            throw validation.errors.all();
            
        } else {            

            let in_data = req.body;
            let userId = req.authData.user_id;
            console.log('userId', userId);
            let result = await restaurantService.insertRestaurant( in_data, userId );
            return res.send({
                status: 200,
                msg: 'Restaurant inserted successfully.',
                data: {
                    rows: result
                }
            });
        }
    } catch(ex) {

        return res.send({
            status: 400,
            msg: ex.toString(),
            data: ex
        });
    }
}

const updateRestaurant = async ( req, res, next ) => {

    try {
        let body = req.body;
        let id = req.params.id;
        let rules = {};
        
        if( _.has( body, 'restaurant_name' ) ) {
            rules.restaurant_name = 'required';
        }

        if( _.has( body, 'restaurant_addr' ) ) {
            rules.restaurant_addr = 'required';
        }

        let validation = new Validator( body, rules );
        console.log('valid');

        if( validation.fails() ) {
            throw validation.errors.all();            
        } else {
            let restaurant = await restaurantService.findRestaurantById( id );
            if( _.isEmpty( restaurant ) ) {
                return res.send({
                    status: 200,
                    msg: 'Restaurant not found.',
                    data: []
                });
            } else {            
                
                restaurant = body;
                let result = await restaurantService.updateRestaurant( restaurant, id );
                return res.send({
                    status: 200,
                    msg: 'Restaurant updated successfully.',
                    data: {
                        rows: result
                    }
                });
            }   
        }        
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            msgStr: ex.toString(),
            data: ex
        });
    }
}

const deleteRestaurant = async ( req, res, next ) => {

    try {
        let id = req.params.id;
        let restaurant = await restaurantService.findRestaurantById( id );
        if( _.isEmpty( restaurant ) ) {
            return res.send({
                status: 200,
                msg: 'Restaurant not found.',
                data: []
            });
        } else {
            
            restaurant.status = 'DELETED';
            let result = await restaurantService.updateRestaurant( restaurant, id );
            return res.send({
                status: 200,
                msg: 'User deleted successfully.',
                data: {
                    rows: result
                }
            });
        }
        
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

const findRestaurant = async ( req, res, next ) => {

    try {

        let id = req.params.id;
        let result = await restaurantService.findRestaurantById( id );
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Restaurant not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'Restaurant found',
                data: {
                    rows: result
                }
            });
        }
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

const findAllRestaurant = async ( req, res, next ) => {
    try {

        let userId = req.authData.userData.user_id;
        let result = await restaurantService.findAllRestaurant();
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Restaurant not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'Users found',
                data: {
                    rows: result,
                    cnt: await restaurantService.countAllRestaurant()
                }
            });
        }
        
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

const findAllRestaurantByUserId = async ( req, res, next ) => {
    try {

        let userId = req.authData.user_id;
        let result = await restaurantService.findAllRestaurantByUserId( userId );
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Restaurant not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'Users found',
                data: {
                    rows: result,
                    // cnt: await restaurantService.countAllRestaurant()
                }
            });
        }
        
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

const changeQrCode = async ( req, res, next ) => {
    try {
        let id = req.params.id;
        let Restaurant = await restaurantService.findRestaurantById( id );
        if( _.isEmpty( user ) ) {
            return res.send({
                status: 200,
                msg: 'User not found.',
                data: []
            });
        } else {
            
            user.profile_pic = req.body.profile_pic;
            let result = await restaurantService.updateUser( user, id );
            return res.send({
                status: 200,
                msg: 'User profile pic changed successfully.',
                data: {
                    rows: result
                }
            });
        }

    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

const generateQrCode = async ( req, res, next ) => {
    try {
        let id = req.body.id;
        let restaurant = await restaurantService.findRestaurantById( id );
        if( _.isEmpty( restaurant ) ) {
            return res.send({
                status: 200,
                msg: 'Restaurant not found.',
                data: []
            });
        } else {
            let qrCode = await restaurantService.generateQrCode( id );
            restaurant.qr_code = qrCode;
            let result = await restaurantService.updateRestaurant( restaurant, id );
            return res.send({
                status: 200,
                msg: 'QrCode assigned successfully.',
                data: {
                    rows: result
                }
            });
        }
    } catch (ex) {
        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

const downloadQrCode = async ( req, res, next ) => {
    try {

        let id = req.params.id;
        let result = await restaurantService.findRestaurantById( id );
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Restaurant not found.',
                data: []
            });
        } else {
            var base64Data = result.qr_code.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            console.log('base64Data', base64Data);
            var img = Buffer.from( base64Data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img); 
        }
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

module.exports = {
    insertRestaurant,
    updateRestaurant,
    deleteRestaurant,
    findRestaurant,
    findAllRestaurant,
    changeQrCode,
    generateQrCode,
    downloadQrCode,
    findAllRestaurantByUserId
};