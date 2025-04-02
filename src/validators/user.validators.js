export const loginControl = (req, res, next) => {
    const newBody = {
        ...req.body,
        firstUser: JSON.parse(req?.body?.firstUser),
        newUser: JSON.parse(req?.body?.newUser)
    }
    req.body = newBody
    next()
}