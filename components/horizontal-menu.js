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
                label: 'menuitems.uielements.list.alerts',
                link: '/admin'
            },

        ]
    },
    {
        id: 8,
        label: 'Automation',
        icon: 'uil-robot',
        subItems: [
            {
                id: 3,
                label: 'menuitems.uielements.list.alerts',
                link: '/admin'
            },

        ]
    },
    {
        id: 9,
        label: 'Settings',
        icon: 'uil-cog',
        subItems: [
            {
                id: 3,
                label: 'menuitems.uielements.list.alerts',
                link: '/admin'
            },

        ]
    }




]