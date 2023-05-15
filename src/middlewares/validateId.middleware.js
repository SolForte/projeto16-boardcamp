export default function validateId(schema) {
  return (req, res, next) => {
    const { error: validationError } = schema.validate(req.params, {
      abortEarly: false,
    });
    if (validationError) {
      const errors = validationError.details.map(({ message }) => message);
      return res.status(400).send(errors);
    }
    return next();
  };
}
