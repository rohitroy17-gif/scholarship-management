import React from 'react';

const Link = ({route}) => {
    return (
        
         <li className='mr-10 px-4 text-black'>
            <b><a  href={route.path}>{route.name}</a></b> 
         </li>
    );
};

export default Link;