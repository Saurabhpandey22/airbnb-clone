//wrapAsync try aur catch ko sahi se likhne ka tarika hai. Isse hum apne code ko clean aur readable bana sakte hain. Jab bhi hum async function likhte hain, to usme error handling ke liye try-catch block ka use karna padta hai. Lekin agar hum wrapAsync function ka use karte hain, to hume har async function me try-catch block likhne ki zarurat nahi hoti. WrapAsync function automatically async function ke andar hone wale errors ko catch kar leta hai aur unhe next() function ke through Express ke error handling middleware tak pahucha deta hai. Isse hum apne code ko zyada concise aur maintainable bana sakte hain.
module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}