const Joi=require("joi");


const ListingJoiSchema=Joi.object({
title:Joi.string().required(),
description:Joi.string().required(),
image:Joi.string().allow("",null),
price:Joi.number().required(),
location:Joi.string().required(),
country:Joi.string().required(),
})

const ReviewJoiSchema=Joi.object({
    review:Joi.object(
        {
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required()

        }
    )
    })

module.exports=ListingJoiSchema;
module.exports=ReviewJoiSchema;