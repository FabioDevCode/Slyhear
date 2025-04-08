export const loginControl = (req, res, next) => {
    const newBody = {
        ...req.body,
        firstUser: req?.body?.firstUser ? JSON.parse(req?.body?.firstUser) : null,
        newUser: req?.body?.newUser ? JSON.parse(req?.body?.newUser) : null
    }
    req.body = newBody
    next()
}