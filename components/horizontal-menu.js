export const menuItems = [
    {
        id: 1,
        label: 'Dashbaord',
        icon: 'uil-home-alt',
        link: '/admin'
    },
    {
        id: 2,
        label: 'Users',
        icon: 'uil-users-alt',
        subItems: [
            {
                id: 3,
                label: 'Users list',
                link: '/admin/users/list'
            },

        ]
    },
    {
        id: 5,
        label: 'Blog',
        icon: 'uil-file-bookmark-alt',
        subItems: [
            {
                id: 501,
                label: 'Blog posts',
                link: '/admin/blog'
            },
            {
                id: 502,
                label: 'Categories',
                link: '/admin/blog/categories'
            }
        ]
    },
    {
        id: 6,
        label: 'Community',
        icon: 'uil-comments',
        subItems: [

            {
                id: 602,
                label: 'Posts',
                link: '/admin/community/posts'
            },

        ]
    },
    {
        id: 7,
        label: 'Family',
        icon: 'uil-baby-carriage',
        subItems: [
            {
                id: 3,
                label: 'Children',
                link: '/admin/family/list'
            },

        ]
    }, {
        id: 8,
        label: 'Market',
        icon: 'uil-shopping-cart-alt',
        subItems: [
            // {
            //     id: 801,
            //     label: 'Subscription plans',
            //     link: '/admin/market/list'
            // }, 
            {
                id: 802,
                label: 'Products',
                link: '/admin/market/products'
            }, 
            // {
            //     id: 803,
            //     label: 'Orders',
            //     link: '/admin/market/orders'
            // }, 
            // {
            //     id: 804,
            //     label: 'Recurring Orders',
            //     link: '/admin/market/list'
            // },
             {
                id: 806,
                label: 'Orders',
                subItems: [
                    {
                        id: 80601,
                        label: 'Active Orders',
                        link: '/admin/market/orders/active',
                    },
                    {
                        id: 80601,
                        label: 'Archived Orders',
                        link: '/admin/market/orders/archived',
                    }
                ]
            }, 
            {
                id: 805,
                label: 'Settings',
                subItems: [
                    {
                        id: 80501,
                        label: 'Categories',
                        link: '/admin/market/settings/categories',
                    },
                    {
                        id: 80502,
                        label: 'Producers',
                        link: '/admin/market/settings/producers',
                    },
                    {
                        id: 80503,
                        label: 'Tax & Shipping',
                        link: '/admin/market/settings/taxandshipping',
                    }


                ]
            },



        ]
    },
    // {
    //     id: 8,
    //     label: 'Automation',
    //     icon: 'uil-robot',
    //     subItems: [
    //         {
    //             id: 3,
    //             label: 'menuitems.uielements.list.alerts',
    //             link: '/admin'
    //         },

    //     ]
    // },
    // {
    //     id: 9,
    //     label: 'Settings',
    //     icon: 'uil-cog',
    //     subItems: [
    //         {
    //             id: 3,
    //             label: 'menuitems.uielements.list.alerts',
    //             link: '/admin'
    //         },

    //     ]
    // }




]