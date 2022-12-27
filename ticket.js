const {REST, Routes} = require('discord.js');
const fs = require('fs');
const { Client, GatewayIntentBits, PermissionsBitField, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
let config = require('./Config/config.json');
let dictionary = require('./lang/dictionary.json');
// const messages = CreateEmbedBuilder();
const buttons = CreateButtons();
const filter = async (i) => 
    i.customId === 'createticket' ||
    i.customId === 'closeticket' ||
    i.customId === 'role_one' || 
    i.customId === 'role_two' ||
    i.customId === 'role_three' ||
    i.customId === 'role_four';
/*{
    // console.log(interaction.options.get('number').value); // вывод второво параметка который передаёт пользователь
}*/

function getLangCategory(i)
{
    let LangText = '';
    switch (i) 
    {
        case config.id_category_ticket_ru:
            LangText = 'ru';
            break;

        default:
            LangText = 'en';
            break;
    }

    return LangText;
}

function lang_text(i) {
    let LangText = '';
    switch (i) 
    {
        case config.channel_ru_ticket_id:
            LangText = 'ru';
            break;

        default:
            LangText = 'en';
            break;
    }

    return LangText;
}

function lang_category(i) {
    let category = '';
    switch (i.channel.id) {
        case config.channel_ru_ticket_id:
            category = config.id_category_ticket_ru;
            break;

        default:
            category = config.id_category_ticket_en;
            break;
    }

    return category;
}

function create_blockInfo_ticket(id_channel) {
    setTimeout(() => {
        const channel = client.channels.cache.get(id_channel);

        // let messages = CreateEmbedBuilder(lang_text(id_channel));
        // let buttons = CreateButtons(lang_text(id_channel));
        // channel.send({embeds: [messages.message_1], components: [new ActionRowBuilder().addComponents(buttons.button_1)]}); // отправлять сообщение в чат
       
        const collector = channel.createMessageComponentCollector({filter});
        const guild = client.guilds.cache.get(config.Guild_id);
        
        collector.on('collect', async i => {
            if (i.customId === 'createticket') {
                createTicket(guild, i, lang_category(i));
            }
        });

        console.log(`"create" button in chat "${channel.name}" restarted`);
    }, 10000);
}

function buffery() {
    let Buffery = config.count_ticket;
    while(Buffery.toString().length < 4)
    {
        Buffery = '0' + Buffery;
    }
    return Buffery;
}

function closeTicket(guild, new_channel, i_new, Buffery, mess) {
    new_channel.edit({
        // name: `${dictionary.ru.channel_closed_ticket_name}${Buffery}`,
        name: `${(getLangCategory(i_new.channel.parentId) == 'ru') ? (dictionary.ru.channel_closed_ticket_name) : (dictionary.eu.channel_closed_ticket_name)}${Buffery}`,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [
                    PermissionsBitField['Flags'].ManageChannels,
                    PermissionsBitField['Flags'].CreateInstantInvite,
                    PermissionsBitField['Flags'].ChangeNickname,
                    PermissionsBitField['Flags'].SendTTSMessages,
                    PermissionsBitField['Flags'].SendMessagesInThreads,
                    PermissionsBitField['Flags'].UseApplicationCommands,
                    PermissionsBitField['Flags'].SendMessages,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].MentionEveryone
                ]
            },
            {
                id: config.id_bot,
                allow: [
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].SendMessages
                ]
            }
        ],
        parent: client.channels.cache.find(ct => ct.name.startsWith(config.name_category_close_ticket)).id,
    })


    i_new.reply({content: `${i_new.user} ${(getLangCategory(i_new.channel.parentId) == 'ru') ? (dictionary.ru.content_close_ticket) : (dictionary.eu.content_close_ticket)} #${Buffery}`});
    mess.then(test => test.delete())
}

function createTicket(guild, i, category_id) {
    let Buffery = buffery();
    return guild.channels.create({
        name: `${(lang_text(i.channel.id) == 'ru') ? (dictionary.ru.channel_ticket_name) : (dictionary.eu.channel_ticket_name)}${Buffery}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [
                    PermissionsBitField['Flags'].ManageChannels,
                    PermissionsBitField['Flags'].CreateInstantInvite,
                    PermissionsBitField['Flags'].ChangeNickname,
                    PermissionsBitField['Flags'].SendTTSMessages,
                    PermissionsBitField['Flags'].SendMessagesInThreads,
                    PermissionsBitField['Flags'].UseApplicationCommands,
                    PermissionsBitField['Flags'].SendMessages,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].MentionEveryone
                ]
            },
            {
                id: i.user.id,
                allow: [
                    PermissionsBitField['Flags'].UseApplicationCommands,
                    PermissionsBitField['Flags'].SendMessages,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].ViewChannel
                ],
                deny: [
                    PermissionsBitField['Flags'].ManageChannels,
                    PermissionsBitField['Flags'].CreateInstantInvite,
                    PermissionsBitField['Flags'].ChangeNickname,
                    PermissionsBitField['Flags'].SendTTSMessages,
                    PermissionsBitField['Flags'].SendMessagesInThreads,
                    PermissionsBitField['Flags'].MentionEveryone
                ]
            },
            {
                id: config.id_bot,
                allow: [
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].SendMessages
                ]
            },
            {
                id: guild.roles.cache.get(config.ticket_admin_ru).id,
                allow: [
                    PermissionsBitField['Flags'].ViewChannel,
                    PermissionsBitField['Flags'].ReadMessageHistory,
                    PermissionsBitField['Flags'].SendMessages
                ],
                deny: [
                    PermissionsBitField['Flags'].CreateInstantInvite,
                    PermissionsBitField['Flags'].ChangeNickname,
                    PermissionsBitField['Flags'].MentionEveryone
                ]
            }
        ],
        parent: lang_category(i),
        }).then(new_channel => {
            i.reply({content: `${(lang_text(i.channel.id) == 'ru') ? (dictionary.ru.content_create_ticket) : (dictionary.eu.content_create_ticket)} <#${new_channel.id}>`, ephemeral: true})
            config.count_ticket++;
            Rewriting(config);

            let mes = CreateEmbedBuilder(lang_text(i.channel.id));
            let but = CreateButtons(lang_text(i.channel.id));
            const mess = new_channel.send({embeds: [mes.message_2], components: [new ActionRowBuilder().addComponents(but.button_2)]});

            const new_collector = new_channel.createMessageComponentCollector({filter});

            new_collector.on('collect', async i_new => {
                if (i_new.customId == 'closeticket') {
                    closeTicket(guild, new_channel, i_new, Buffery, mess);
                }
            })
        })
        .catch(console.error);
}

function CreateEmbedBuilder(lang)
{
        const message_1 = new EmbedBuilder()
        .setColor('#FA747D')
        .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_1.title_main) : (dictionary.eu.embed_builder.message_1.title_main)) 
        .setAuthor({name: (lang == 'ru') ? (dictionary.ru.embed_builder.message_1.author) : (dictionary.eu.embed_builder.message_1.author)})
        .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_1.title_additional) : (dictionary.eu.embed_builder.message_1.title_additional))
        .setDescription((lang == 'ru') ? (dictionary.ru.embed_builder.message_1.description) : (dictionary.eu.embed_builder.message_1.description))


         const message_2 = new EmbedBuilder()
            .setColor('#FA747D')
            .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_2.title_main) : (dictionary.eu.embed_builder.message_2.title_main)) 
            .setAuthor({name: (lang == 'ru') ? (dictionary.ru.embed_builder.message_2.author) : (dictionary.eu.embed_builder.message_2.author)})
            .setTitle((lang == 'ru') ? (dictionary.ru.embed_builder.message_2.title_additional) : (dictionary.eu.embed_builder.message_2.title_additional))
            .setDescription((lang == 'ru') ? (dictionary.ru.embed_builder.message_2.description) : (dictionary.eu.embed_builder.message_2.description))
    
    return {message_1, message_2};
}

function CreateButtons(lang)
{
    const button_1 = new ButtonBuilder()
        // .setCustomId((lang == 'ru') ? (dictionary.ru.buttons.button_1.id) : ())
        .setCustomId((lang == 'ru') ? (dictionary.ru.buttons.button_1.id) : (dictionary.eu.buttons.button_1.id))
        .setLabel((lang == 'ru') ? (dictionary.ru.buttons.button_1.label) : (dictionary.eu.buttons.button_1.label))
        .setStyle(ButtonStyle.Success)
        .setEmoji((lang == 'ru') ? (dictionary.ru.buttons.button_1.emoji) : (dictionary.eu.buttons.button_1.emoji))


    const button_2 = new ButtonBuilder()
        .setCustomId((lang == 'ru') ? (dictionary.ru.buttons.button_2.id) : (dictionary.eu.buttons.button_2.id))
        .setLabel((lang == 'ru') ? (dictionary.ru.buttons.button_2.label) : (dictionary.eu.buttons.button_2.label))
        .setStyle(ButtonStyle.Danger)
        .setEmoji((lang == 'ru') ? (dictionary.ru.buttons.button_2.emoji) : (dictionary.eu.buttons.button_2.emoji))

    return {button_1, button_2};
}

function checkRole(interaction) 
{
    for (let i = 0; i <= interaction.member._roles.length; i++) {
        for (let j = 0; j < config.roleImmunityId.length; j++) {
            if (interaction.member._roles[i] == config.roleImmunityId[j]) {
                return 1;
            }
        }
    }
    return 0;
}

function role_add() {
    const channel = client.channels.cache.get(config.get_role_channel_id);
    
    const message_1 = new EmbedBuilder()
        .setColor('#C70039')
        .setTitle('Приветствуем в дискорд сервере Турнирной платформы SDTV.GG') 
        // .setAuthor('SDTV.GG')
        .setDescription('Нажимай на кнопки для получение ролей.')


    const button_1 = new ButtonBuilder()
        .setCustomId('role_one')
        .setLabel('EU | Tournament')
        .setStyle(ButtonStyle.Secondary)

    const button_2 = new ButtonBuilder()
        .setCustomId('role_two')
        .setLabel('RU | Tournament')
        .setStyle(ButtonStyle.Secondary)

    const button_3 = new ButtonBuilder()
        .setCustomId('role_three')
        .setLabel('EU | GameServers')
        .setStyle(ButtonStyle.Success)

    const button_4 = new ButtonBuilder()
        .setCustomId('role_four')
        .setLabel('RU | GameServers')
        .setStyle(ButtonStyle.Success)

    const new_collector = channel.createMessageComponentCollector({filter});

    new_collector.on('collect', async i_new => {
        const guild = client.guilds.cache.get(config.Guild_id);
        if (i_new.customId == 'role_one') {
            // Тут функция выдачи роли или её забирания, Жека допиши я вмер.

            // // if (i_new.member.roles) {
            //     i_new.member.roles.add(guild.roles.cache.get(config.add_role_test));
            // // }
            const name_role = guild.roles.cache.get(config.add_role_one).name;
            let bBool = false;
            for(let i = 0; i < i_new.member._roles.length; i++)
            {
                if(i_new.member._roles[i] == config.add_role_one) 
                {
                    i_new.member.roles.remove(guild.roles.cache.get(config.add_role_one));
                    i_new.reply({content: `Роль ${name_role} была удалена`, ephemeral: true})
                    bBool = true; break;
                }
            }
            if(bBool == false)
            {
                i_new.member.roles.add(guild.roles.cache.get(config.add_role_one));
                i_new.reply({content: `Роль ${name_role} была добавлена`, ephemeral: true})
            }
        }
        if (i_new.customId == 'role_two') {
            // Тут функция выдачи роли или её забирания, Жека допиши я вмер.

            // // if (i_new.member.roles) {
            //     i_new.member.roles.add(guild.roles.cache.get(config.add_role_test));
            // // }
            const name_role = guild.roles.cache.get(config.add_role_two).name;

            let bBool = false;
            for(let i = 0; i < i_new.member._roles.length; i++)
            {
                if(i_new.member._roles[i] == config.add_role_two) 
                {
                    i_new.member.roles.remove(guild.roles.cache.get(config.add_role_two));
                    i_new.reply({content: `Роль ${name_role} была удалена`, ephemeral: true})
                    bBool = true; break;
                }
            }
            if(bBool == false)
            {
                i_new.member.roles.add(guild.roles.cache.get(config.add_role_two));
                i_new.reply({content: `Роль ${name_role} была добавлена`, ephemeral: true})
            }
        }
        if (i_new.customId == 'role_three') {
            const name_role = guild.roles.cache.get(config.add_role_three).name;
            let bBool = false;
            for(let i = 0; i < i_new.member._roles.length; i++)
            {
                if(i_new.member._roles[i] == config.add_role_three) 
                {
                    i_new.member.roles.remove(guild.roles.cache.get(config.add_role_three));
                    i_new.reply({content: `Роль ${name_role} была удалена`, ephemeral: true})
                    bBool = true; break;
                }
            }
            if(bBool == false)
            {
                i_new.member.roles.add(guild.roles.cache.get(config.add_role_three));
                i_new.reply({content: `Роль ${name_role} была добавлена`, ephemeral: true})
            }
        }
        if (i_new.customId == 'role_four') 
        {
            let bBool = false;
            const name_role = guild.roles.cache.get(config.add_role_three).name;
            for(let i = 0; i < i_new.member._roles.length; i++)
            {
                if(i_new.member._roles[i] == config.add_role_four) 
                {
                    i_new.member.roles.remove(guild.roles.cache.get(config.add_role_four));
                    i_new.reply({content: `Роль ${name_role} была удалена`, ephemeral: true})
                    bBool = true; break;
                }
            }
            if(bBool == false)
            {
                i_new.member.roles.add(guild.roles.cache.get(config.add_role_four));
                i_new.reply({content: `Роль ${name_role} была добавлена`, ephemeral: true})
            }
        }
    })
        
    channel.send({embeds: [message_1], components: [new ActionRowBuilder().addComponents(button_1, button_2, button_3, button_4)]});
    
}


(async () => {
    try {
        create_blockInfo_ticket(config.channel_ru_ticket_id);
        create_blockInfo_ticket(config.channel_en_ticket_id);
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', async () => {
    console.log(`Bot logged in as ${client.user.tag}!`);
    role_add();
});

client.login(config.Token);

function Rewriting(newJson)
{
    fs.writeFileSync('./Config/config.json', JSON.stringify(newJson));
}