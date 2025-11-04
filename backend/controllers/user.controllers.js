import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import Notification from "../models/notification.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId).select("-password").populate('posts loops posts.author posts.comments saved saved.author story following')
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: `get current user error: ${error}` });
  }
};


export const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.userId }
        }).select('-password')
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message: `suggested users error ${error}`})

    }
}


export const editProfile = async (req,res)=> {
    try {
        const { name,userName,bio, profession, gender } = req.body
        const user = await User.findById(req.userId).select('-password')
        if(!user){
            return res.status(404).json({message: "User not found"})

        }
        const sameUserWithUserName = await User.findOne({userName}).select('-password')
        if(sameUserWithUserName && sameUserWithUserName._id!=req.userId){
            return res.status(400).json({message: "Username already exist"})
        }
        let profileImage;
        if(req.file){
          profileImage =  await uploadOnCloudinary(req.file.path)
        }

        user.name = name
        user.userName = userName
        user.bio = bio
        user.profession = profession
        user.gender = gender
        if(profileImage){
          user.profileImage = profileImage
        }

        await user.save()
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `edit profile error ${error}`})   
    }
}


export const getProfile = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName }).select("-password").populate('posts loops followers following');
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Get profile error: ${error}` });
  }
};



export const follow = async (req,res)=>{
  try {
    const currentUserId = req.userId
    const targetUserId = req.params.targetUserId

    if(!targetUserId){
      return res.status(400).json({message: 'target user is not found'})
    }

    if(currentUserId == targetUserId){
      return res.status(400).json({message: 'you can not follow yourself.'})
    }

    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)

    if(!currentUser){
      return res.status(404).json({message: 'Current user not found'})
    }

    if(!targetUser){
      return res.status(404).json({message: 'Target user not found'})
    }

    const isFollowing = currentUser.following.includes(targetUserId)

    if(isFollowing){
      currentUser.following = currentUser.following.filter(id=>id.toString() != targetUserId)
      targetUser.followers = targetUser.followers.filter(id=>id.toString()!= currentUserId)
      await currentUser.save()
      await targetUser.save()
      return res.status(200).json({
        following: false,
        message: 'unfollow successfully'
      })

    }
    else{
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
           if(currentUser._id != targetUser._id){
            const notification = await Notification.create({
                sender:currentUser._id,
                receiver:targetUser._id,
                type:'follow',
                message:'started following you'
            })
            const populatedNotification = await Notification.findById(notification._id).populate('sender receiver')
            const receiverSocketId = getSocketId(targetUser._id)
            if(receiverSocketId){
                io.to(receiverSocketId).emit('newNotification',populatedNotification)
            }
        }
      await currentUser.save()
      await targetUser.save()
      return res.status(200).json({
        following:true,
        message: 'follow successfully'
      })
    }

    
  } catch (error) {
     return res.status(500).json({message:`follow error ${error}`})
  }
}



export const followingList = async (req,res)=>{
  try {
    const result = await User.findById(req.userId)
    return res.status(200).json(result?.following)
    
  } catch (error) {
    return res.status(500).json({message: `folow error ${error}`})
    
  }
}


export const search = async (req,res)=>{
  try {
    const keyWord = req.query.keyWord

    if(!keyWord){
      return res.status(400).json({message: 'keyword is required'})
    }
    const users = await User.find({
      $or:[
        {userName:{$regex:keyWord,$options:'i'}},
        {name:{$regex:keyWord,$options:'i'}}
      ]
    }).select('-password')

    return res.status(200).json(users)
    
  } catch (error) {
    return res.status(500).json({message:`search error ${error}`})
    
  }
}


export const getAllNotifications = async(req,res)=>{
  try {
    const notifications = await Notification.find({
      receiver:req.userId
    }).populate('sender receiver post loop').sort({createdAt: -1})
    return res.status(200).json(notifications)
    
  } catch (error) {
    return res.status(500).json({message:`get notification error ${error}`})
    
  }
}



export const markAsRead = async (req,res)=>{
  try {
    const {notificationId} = req.body
    if(Array.isArray(notificationId)){
      await Notification.updateMany(
        {_id: {$in: notificationId},receiver:req.userId},
        {$set:{isRead: true}}
      )
    }
    else{
      await Notification.findOneAndUpdate(
        {_id: notificationId , user: req.userId},
        {$set: {isRead: true}}
      )
    }
    return res.status(200).json({message:'marked as read'})


  } catch (error) {
    return res.status(500).json({message:`read notification error ${error}`})
    
  }
}



