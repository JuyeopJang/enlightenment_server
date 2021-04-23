const { user, magazine, image } = require('../models');

module.exports = {
    getMagazines: async (req, res) => {
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
            delete createdMagazine.dataValues.updatedAt
            res.status(201).json({
                ...createdMagazine.dataValues
            })
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
    },
    uploadImage: async (req, res) => {
        if (req.file) {
            res.json({ uploaded: true, url: req.file.location });
        } else {
            res.status(500).json({uploaded: false, error: new Error('Image was not uploaded!')});
        }
    },
    updateMagazineLike: async (req, res) => {
        const { magazineId } = req.params;
        const updatedMagazine = await magazine.findOne({
            where: {
                id: magazineId
            }
        })
        if (updatedMagazine) {
            await magazine.update({
                like: updatedMagazine.dataValues.like + 1
            }, {
                where: {
                  id: magazineId
                }
            });
            res.status(200).json({
                message: 'Successfully updated'
            })
        } else {
            res.status(404).json({
                message: 'send proper commentId'
            })
        }
    }
}