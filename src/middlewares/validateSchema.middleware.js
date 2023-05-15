export default function validateSchema(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors = error.details.map(({ message }) => message);
        return res.status(422).send(errors);
      }
      return next();
    };
  }
  