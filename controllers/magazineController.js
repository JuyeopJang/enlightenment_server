const { user, magazine, image } = require('../models');

module.exports = {
    getMagazines: async (req, res) => {
        console.log(req.user)
        const magazinesImages = await magazine.findAll({
            include: [{
            model: image,
            }]
        })
        if (magazinesImages) {
            const responseMagazines = await magazinesImages.map(magazine => {
                delete magazine.dataValues.updatedAt
                magazine.dataValues.images = magazine.dataValues.images.map(image => {
                    delete image.dataValues.magazineId;
                    delete image.dataValues.createdAt;
                    delete image.dataValues.updatedAt;
                    return image.dataValues;
                })
                return magazine.dataValues
            })

            res.status(200).json({
                magazines: responseMagazines
            })
        } else {
            res.status(200).json({
                magazines: []
            })
        }
    },
    createMagazine: async (req, res) => {
        const { title, description } = req.body
        const { userId } = req.user
        if (title && description) {
            const createdMagazine = await magazine.create({
                title,
                description,
                userId,
                score: 0,
                count: 0
            })
            const imagesInfo = req.files;
            if (imagesInfo.length !== 0) {
                const imagesPath = imagesInfo.map(image => {
                    return {
                        url: image.location,
                        magazineId: createdMagazine.dataValues.id
                    }
                });
                
                const images = await image.bulkCreate(imagesPath)
                if (images[0].dataValues.id) {
                    res.status(201).json({
                        message: 'Successfully created!'
                    })
                } else {
                    res.status(500).json({
                        message: 'Server error has occurred!'
                    })
                }
                
            } else {
                res.status(201).json({
                    message: 'Successfully created but images are none'
                })
            }
        } else {
            res.status(400).json({
                message: "제목과 본문은 필수 항목입니다!"
            })
        }
    },
    patchMagazine: async (req, res) => {
        const { magazineId } = req.params;
        res.send(magazineId)
    },
    deleteMagazine: async (req, res) => {
        const { magazineId } = req.params;
        const deletedMagazine = await magazine.findByPk(Number(magazineId))
        if (deletedMagazine) {
            await magazine.destroy({
                where: {
                    id: Number(magazineId)
                }
            })
            res.status(200).json({
                message: 'Successfully deleted'
            })
        } else {
            res.status(400).json({
                message: 'send proper magazineId'
            })
        }
    }
}