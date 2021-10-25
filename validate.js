import joi from 'joi';

const val =  joi.object({
    username: joi.string(), 
    email: joi.string(), 
    password:joi.string().min(8).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
}).length(3);

export {val}