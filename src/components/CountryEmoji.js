import React from 'react';
import PropTypes from 'prop-types'
import Emoji from './Emoji'

const CountryEmoji = ({ country }) => {

    const getEmoji = (country) => {
        switch (country) {
            case 'England':
                return 'đ´ó §ó ˘ó Ľó Žó §ó ż';
            case 'USA':
                return 'đşđ¸';
            case 'Croatia':
                return 'đ­đˇ';
            case 'Morocco':
                return 'đ˛đŚ';
            case 'Qatar':
                return 'đśđŚ';
            case 'France':
                return 'đŤđˇ';
            case 'Senegal':
                return 'đ¸đł';
            case 'Costa Rica':
                return 'đ¨đˇ';
            case 'Japan':
                return 'đŻđľ';
            case 'Saudi Arabia':
                return 'đ¸đŚ';
            case 'Brazil':
                return 'đ§đˇ';
            case 'Ghana':
                return 'đŹđ­';
            case 'Uruguay':
                return 'đşđž';
            case 'Switzerland':
                return 'đ¨đ­';
            case 'Portugal':
                return 'đľđš';
            case 'Belgium':
                return 'đ§đŞ';
            case 'Serbia':
                return 'đˇđ¸';
            case 'Germany':
                return 'đŠđŞ';
            case 'Spain':
                return 'đŞđ¸';
            case 'Poland':
                return 'đľđą';
            case 'Wales':
                return 'đ´ó §ó ˘ó ˇó Źó łó ż';
            case 'Mexico':
                return 'đ˛đ˝';
            case 'Tunisia':
                return 'đšđł';
            case 'Ecuador':
                return 'đŞđ¨';
            case 'Australia':
                return 'đŚđş';
            case 'Canada':
                return 'đ¨đŚ';
            case 'Denmark':
                return 'đŠđ°';
            case 'Korea Republic':
                return 'đ°đˇ';
            case 'Iran':
                return 'đŽđˇ';
            case 'Argentina':
                return 'đŚđˇ';
            case 'Netherlands':
                return 'đłđą';
            case 'Cameroon':
                return 'đ¨đ˛';
            default:
                return '';
        }
    }

    return (
        <Emoji symbol={getEmoji(country)} />
    )
}

CountryEmoji.propTypes = {
    country: PropTypes.string.isRequired,
}

export default CountryEmoji