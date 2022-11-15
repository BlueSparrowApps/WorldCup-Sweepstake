import React from 'react';
import PropTypes from 'prop-types'
import Emoji from './Emoji'

const CountryEmoji = ({ country }) => {

    const getEmoji = (country) => {
        switch (country) {
            case 'England':
                return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
            case 'USA':
                return '🇺🇸';
            case 'Croatia':
                return '🇭🇷';
            case 'Morocco':
                return '🇲🇦';
            case 'Qatar':
                return '🇶🇦';
            case 'France':
                return '🇫🇷';
            case 'Senegal':
                return '🇸🇳';
            case 'Costa Rica':
                return '🇨🇷';
            case 'Japan':
                return '🇯🇵';
            case 'Saudi Arabia':
                return '🇸🇦';
            case 'Brazil':
                return '🇧🇷';
            case 'Ghana':
                return '🇬🇭';
            case 'Uruguay':
                return '🇺🇾';
            case 'Switzerland':
                return '🇨🇭';
            case 'Portugal':
                return '🇵🇹';
            case 'Belgium':
                return '🇧🇪';
            case 'Serbia':
                return '🇷🇸';
            case 'Germany':
                return '🇩🇪';
            case 'Spain':
                return '🇪🇸';
            case 'Poland':
                return '🇵🇱';
            case 'Wales':
                return '🏴󠁧󠁢󠁷󠁬󠁳󠁿';
            case 'Mexico':
                return '🇲🇽';
            case 'Tunisia':
                return '🇹🇳';
            case 'Ecuador':
                return '🇪🇨';
            case 'Australia':
                return '🇦🇺';
            case 'Canada':
                return '🇨🇦';
            case 'Denmark':
                return '🇩🇰';
            case 'Korea Republic':
                return '🇰🇷';
            case 'Iran':
                return '🇮🇷';
            case 'Argentina':
                return '🇦🇷';
            case 'Netherlands':
                return '🇳🇱';
            case 'Cameroon':
                return '🇨🇲';
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