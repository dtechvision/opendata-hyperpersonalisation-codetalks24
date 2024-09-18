Here is the solution

```
      // // personalize based on username
      // if(session.user?.name?.includes("samuel"))
      //   setSelectedBasin("bathroom");

      // // personalize based on holding more then 0.1 ETH or not
      // getWalletAddress(session.user?.name!).then(
      //   (address) => {
      //     console.log('getWalletAddess returned:', address)
      //     publicClient.getBalance({ 
      //       address: address
      //     }).then(
      //       (bal) => {
      //         if(bal >= parseEther("0.1"))
      //           setSelectedBasin('utility')
      //       }
      //     )
      //   }
      // );

      // // personalize based on social media content
      // getRecentPosts(session.user?.name!).then(
      //   (posts) => {
      //     if(posts.includes('bathroom')) {
      //       console.log('Users posts include the word bathroom')
      //       setSelectedBasin('bathroom');
      //     } else {
      //       console.log('Users posts do not include the word bathroom')
      //     }
      //   }
      // )
```