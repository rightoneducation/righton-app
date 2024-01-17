import { Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import BarGroup from '../../lib/styledcomponents/footer/BarGroup';
import InputNum from '../../lib/styledcomponents/footer/InputNum';
import TotalNum from '../../lib/styledcomponents/footer/TotalNum';
import ProgressBar from '../../lib/styledcomponents/footer/ProgressBar';

interface FooterProps{
    inputNum: number;
    totalNum: number;
}   // eslint-disable-line

export default function Footer({
    inputNum,
    totalNum
}: FooterProps) {
    const theme = useTheme();   //eslint-disable-line
    const { t } = useTranslation();
    
    const progressPercent =
    inputNum !== 0 ? (inputNum / totalNum) * 100 : 0;

    const BarContainer = styled(Box)({
        position: 'relative',
        width: '100%',
    });
    
    return(
        <BarGroup>
            <BarContainer>
                <ProgressBar
                    variant="determinate"
                    value={progressPercent}
                ></ProgressBar>
                <InputNum progressPercent={progressPercent}>
                    {inputNum}
                </InputNum>
            </BarContainer>
            <TotalNum>
                {totalNum}
            </TotalNum>
        </BarGroup>
    );
}